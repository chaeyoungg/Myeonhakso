'use server';

import DetailCurriculum from '@/app/(edu)/[type]/[id]/DetailCurriculum';
import { ShareButton } from '@/app/(edu)/[type]/[id]/ShareButton';
import BookmarkLecture from '@/components/BookmarkLecture';
import Button from '@/components/Button';
import Card from '@/components/Card';
import KakaoMap from '@/components/KakaoMap';
import {
  fetchLecture,
  fetchLectureDetail,
  fetchOtherLectures,
} from '@/data/fetchLecture';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import moment from 'moment';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const item = await fetchLectureDetail(params.id);
  if (item === null) notFound();
  return {
    title: `${item.name}`,
    description: `${item.content}`,
    openGraph: {
      title: `${item.name}`,
      description: `${item.content}`,
      url: `/order/${params.id}`,
    },
  };
}

async function OrderDetailPage({ params }: { params: { id: string } }) {
  const item = await fetchLectureDetail(params.id);
  const seller_id = item?.seller._id;
  const type = item?.extra.type;
  const otherData = await fetchOtherLectures(String(seller_id!), '4');
  const popularData = await fetchLecture(
    'products',
    { bookmarks: -1 },
    String(4),
  );

  let isBookmarked = false;
  let bookmarkId: number | null = null;

  // if (user) {
  //   // 강의 북마크 데이터
  //   const data = await fetchLectureBookmark();
  //   const product = data.item;

  //   const bookmarkedItem = product.find((item: IBookmark) => {
  //     return item.product && item.product._id === Number(params.id);
  //   });
  //   if (bookmarkedItem) {
  //     isBookmarked = true;
  //     bookmarkId = bookmarkedItem._id;
  //   }
  // }

  // 지금 강의는 다른 강의에서 빼야됨,,,
  // 목록(type) 카드 사이즈 맞추기
  const otherLectureList = otherData?.map((item, index) => (
    <div
      className="max-w-[300px] h-[320px] rounded-xl flex flex-grow justify-between"
      key={index}
    >
      <Card key={index} item={item} />
    </div>
  ));

  const popularLectureList = popularData?.map((item, index) => (
    <div
      className="max-w-[300px] h-[320px] rounded-xl flex flex-grow justify-between"
      key={index}
    >
      <Card key={index} item={item} />
    </div>
  ));

  //TODO: 1:1문의하기 처리할 것
  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-light-green z-0" />

      <div className="relative z-10 pt-20">
        <div className="max-w-[1500px] min-w-[380px] mx-auto px-10 w-full">
          <div className="-mt-20">
            <div className="pt-20">
              <div className="flex gap-5 w-full md:flex-col">
                <div className="rounded-3xl bg-gray-10 px-20 py-8 md:px-10 md:py-8 gap-2 box-border flex flex-col border border-main-light-green/50 justify-evenly flex-grow">
                  <h2 className="sm:text-xl text-2xl font-extrabold">
                    {item?.name}
                  </h2>
                  <p className="sm:text-md">{item?.content}</p>
                  <div className="sm:mx-auto flex gap-3">
                    <BookmarkLecture
                      params={params}
                      initialIsBookmarked={isBookmarked}
                      bookmarkId={bookmarkId}
                      type={type}
                    />
                    <ShareButton />
                  </div>

                  <div className="sm:mx-auto ml-auto bg-main-green px-3 py-1 rounded-md text-lg text-white">
                    <Link
                      href={{
                        pathname: '/mypage/tutee/qna/new',
                        query: item?._id.toString(),
                      }}
                    >
                      1:1 문의하기
                    </Link>
                  </div>
                  {/* </Button> */}
                </div>
              </div>

              <div className="mt-[50px]">
                <h2 className="text-2xl font-black mb-4">강의 일정</h2>
                <div className="rounded-3xl bg-gray-10 h-[170px] px-8 py-10 border-box flex place-content-evenly items-center md:flex-col md:items-start md:gap-5">
                  <div className="flex gap-4 items-center">
                    <Image
                      src="/calendar.svg"
                      width={40}
                      height={40}
                      alt="일정"
                    />
                    <p>
                      {moment(item?.extra?.schedule[0]).format('YYYY-MM-DD') ??
                        ''}{' '}
                      ~{' '}
                      {moment(item?.extra?.schedule[1]).format('YYYY-MM-DD') ??
                        ''}
                    </p>
                  </div>

                  {item?.extra?.options.map((option, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <Image
                        src="/time.svg"
                        width={40}
                        height={40}
                        alt="시간"
                      />
                      <div>
                        <p>
                          {option.days.join(', ')} {option.startTime ?? ''} ~{' '}
                          {option.endTime ?? ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {item?.extra?.address === '' ? (
                <div className="mt-[50px]">
                  <h2 className="text-2xl font-black">화상 강의</h2>
                  <div className="mt-5 place-content-center">
                    <p className="text-2xl">{item?.extra?.url}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-[50px]">
                  <h2 className="text-2xl font-black">대면 강의</h2>
                  <div className="rounded-3xl bg-gray-10 border border-main-light-green/50 mt-5">
                    <KakaoMap address={item?.extra?.address!} />
                    <p className="p-3">{item?.extra.address}</p>
                  </div>
                </div>
              )}

              <div className="mt-[50px]">
                <h2 className="text-2xl font-black">강의 맛보기</h2>
                <div
                  className="rounded-3xl bg-gray-10 w-full relative border border-main-light-green/50 mt-5 overflow-hidden"
                  style={{ paddingTop: '56.25%' }}
                >
                  <iframe
                    src={item?.extra.preview}
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full border-0"
                  />
                </div>
              </div>

              <div className="mt-[50px]">
                <div className="flex flex-col gap-3">
                  <h2 className="text-2xl font-black">커리큘럼</h2>
                  <DetailCurriculum item={item} />
                </div>
              </div>

              <div className="mt-[50px]">
                <h3 className="font-bold mb-5">
                  {item?.seller.name} 선생님의 다른 강의
                </h3>
                <div className="grid grid-cols-4 md:grid-cols-2 content-start">
                  {otherLectureList}
                </div>
              </div>
              <div className="mt-[50px]">
                <h3 className="font-bold mb-5">인기 있는 토픽</h3>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-2 content-start mb-[50px]">
                {popularLectureList}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
