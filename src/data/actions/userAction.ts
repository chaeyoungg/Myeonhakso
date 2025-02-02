import { getSession } from '@/auth';
import {
  ApiResWithValidation,
  FileRes,
  MultiItem,
  SingleItem,
  UserData,
  UserForm,
} from '@/types';
import { normalizeImageUrl } from '@/utils/imageUrlUtils';
import { Session } from 'next-auth';

const SERVER = process.env.NEXT_PUBLIC_API_SERVER;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;


export async function signup(formData: FormData): Promise<ApiResWithValidation<SingleItem<UserData>, UserForm>> {
	const userData = {
    type: formData.get('type') || 'user',
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    address: formData.get('address'),
    image: '',
  }

		const attach = formData.get('attach') as File;
    if (attach && attach.size > 0) {
      const fileFormData = new FormData();
      fileFormData.append('attach', attach);


    const fileRes = await fetch(`${SERVER}/files`, {
      method: 'POST',
      headers: {
        'client-id': `${CLIENT_ID}`,
      },
      body: fileFormData,
    });

    if (!fileRes.ok) {
      const errorMsg = await fileRes.text();
      console.error('File upload failed:', errorMsg);
      throw new Error(`파일 업로드 실패: ${errorMsg}`);
    }
    const fileData: MultiItem<FileRes> = await fileRes.json();

    userData.image = fileData.item[0].path;

  } else if (formData.get('type') === 'seller') {
    // seller 타입인데 attach가 없을 경우 예외 처리
    throw new Error('강사회원은 프로필 이미지를 반드시 업로드해야 합니다.');
  }

  const res = await fetch(`${SERVER}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'client-id': `${CLIENT_ID}`,
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  return data;
}

export async function uploadUserImage(
  attach: File,
  accessToken: string,
): Promise<string> {
  const fileFormData = new FormData();
  fileFormData.append('attach', attach);

  const fileRes = await fetch(`${SERVER}/files`, {
    method: 'POST',
    headers: {
      'client-id': `${CLIENT_ID}`,
      Authorization: `Bearer ${accessToken}`,
    },
    body: fileFormData,
  });

  if (!fileRes.ok) {
    const errorMsg = await fileRes.text();
    console.error('File upload failed:', errorMsg);
    throw new Error(`파일 업로드 실패: ${errorMsg}`);
  }

  const fileData: MultiItem<FileRes> = await fileRes.json();
   const imagePath = fileData.item[0].path;
   return imagePath; 
}

export async function editUserInfo(
  formData: FormData,
  session: Session,
): Promise<ApiResWithValidation<SingleItem<UserData>, UserForm>> {
  const userData = {
    type: formData.get('type') || 'user',
    name: formData.get('name'),
    email: formData.get('email'),
    address: formData.get('address'),
    image: formData.get('image') || '',

  };

  const imageValue = formData.get('image');

  if (typeof imageValue === 'string') {
    userData.image = normalizeImageUrl(imageValue);
  } else if (imageValue instanceof File) {
    try {
      const uploadedImageUrl = await uploadUserImage(imageValue, session.accessToken);
      userData.image = normalizeImageUrl(uploadedImageUrl);
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw new Error('Image upload failed');
    }
  }
  const res = await fetch(`${SERVER}/users/${session?.user?.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'client-id': `${CLIENT_ID}`,
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  return data;
}

export async function postUserBookmark(id: string) {
  const session = await getSession();

  const res = await fetch(`${SERVER}/bookmarks/user/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'client-id': `${CLIENT_ID}`,
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  const resData = await res.json();
  console.log('data', resData);
  return resData;
}

