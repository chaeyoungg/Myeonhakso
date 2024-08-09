import { auth } from '@/auth';
import Link from 'next/link';
import LoginInfo from './LoginInfo';
import SessionHandler from './SessionHandler';
import { Session } from 'next-auth';
import Categories from './Categories';
import Button from '../Button';

export default async function Header() {
  const session: Session | null = await auth();
  let type;
  if(session?.user?.type === 'seller'){
    type = 'tutor';
  }else if(session?.user?.type === 'user'){
    type = 'tutee';
  }
  console.log('session', session);

  return (
    <div className="box-border px-10 py-3 border-b-[3px] h-[85px] flex-shrink-0 flex items-center">
      <Link href="/" className="w-14 h-14 mr-20">
        <img src="/logo.svg" className="h-full min-w-full" />
      </Link>
      <Categories />
      <div className="flex justify-end items-center ml-auto">
        {session?.user ? (
          <>
            <Button><Link href= {`/mypage/${type}/dashboard`}> 내 강의실 </Link></Button>
            <LoginInfo name={session.user.name!} image={session.user.image} />
            <SessionHandler session={session} />
          </>
        ) : (
          <div className="flex justify-end">
            <Link
              href="/login"
              className="py-1 px-2 text-sm text-gray-500 hover:bg-main-green rounded hover:text-white"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="py-1 px-2 text-sm text-gray-500 hover:bg-main-green rounded hover:text-white"
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
