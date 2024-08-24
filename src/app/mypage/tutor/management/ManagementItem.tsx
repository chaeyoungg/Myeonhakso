'use client';

import Button from '@/components/Button';
import { useFetchLecture } from '@/hooks/useLectureActions';
import { Ilecture } from '@/types/lecture';
import Link from 'next/link';
import { useState } from 'react';

interface IProduct {
  item: Ilecture;
}
export default function ManagementItem({ item }: IProduct) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteLecture } = useFetchLecture();

  const handleLectureDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteLecture(String(item._id));
      setIsDeleted(true);
      alert('강의가 삭제되었습니다.');
    } catch (error) {
      console.error('강의 삭제 실패:', error);
      alert('강의 삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isDeleted) {
    return null;
  }

  return (
    // <div className="flex justify-center">
    //   <img
    //     className="border border-red-500 w-36 h-20"
    //     src="lecture-default.jpg"
    //   />
    //   <h4 className="border border-red-500">기초 탄탄 중국어 입문</h4>
    //   <p className="border border-red-500">3.0</p>
    //   <p className="border border-red-500">10</p>
    //   <p className="border border-red-500">₩ 55,000</p>
    //   <div className="flex flex-col border border-red-500">
    //     <Button>강의 수정</Button>
    //     <Button>강의 관리</Button>
    //   </div>
    // </div>
    <div className="flex text-center py-3 border-b-4 border-gray-30">
      <div className="basis-2/12">
        <img
          src="/lecture-default.jpg"
          alt="강의 대표 이미지"
          onError={e => {
            const target = e.target as HTMLImageElement;
            // target.setAttribute('src', '/lecture-default.jpg')
            target.src = '/lecture-default.jpg';
          }}
        />
      </div>
      <p className="basis-3/12 px-2 keep-all">{item?.name}</p>
      <p className="basis-1/12 sm:hidden">4.5</p>
      <p className="basis-2/12 sm:hidden">{item?.buyQuantity}</p>
      <p className="basis-2/12">
        {(item?.price * item?.buyQuantity)
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
      </p>
      <div className=" items-center flex flex-col gap-2 basis-2/12">
        <Link
          href={`/${item?.extra.type}/${item?._id}/edit`}
          className="lg:px-1 lg:text-xs xl:px-3 text-sm w-fit rounded-md py-1 px-5 border border-black"
        >
          강의 수정
        </Link>
        {/* <Link
          href="/"
          className="lg:px-2 lg:text-xs xl:px-3 text-white bg-gray-90 w-fit rounded-md text-sm py-1 px-5 border border-black"
        >
          강의 삭제
        </Link> */}
        <Button
          className="lg:px-2 lg:text-xs xl:px-3 text-white bg-gray-90 w-fit rounded-md text-sm py-1 px-5 border border-black"
          onClick={handleLectureDelete}
          disabled={isDeleting}
        >
          강의 삭제
        </Button>
      </div>
    </div>
  );
}
