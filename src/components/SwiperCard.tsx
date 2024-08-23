'use client';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import './swipercard.css';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';
import Card from './Card';
import { Ilecture } from '@/types/lecture';
import useSWR from 'swr';
import TeacherCard from './TeacherCard';
import { fetchLecture, fetchTeacher } from '@/data/fetchLecture';
import { UserData } from '@/types';

function SwiperCard({ sortParam }: { sortParam: string }) {
  const path = 'products';
  const sort = { [sortParam]: -1 };
  let list;

  const getLectures = async (path: string, sort?: object) => {
    const data = await fetchLecture(path, sort);
    return data;
  };
  const getTeachers = async () => {
    const data = await fetchTeacher();
    return data;
  };

  const {
    data: lecturesData,
    error: lecturesError,
    isLoading: lecturesLoading,
  } = useSWR<Ilecture[] | null>([path, sort], () => getLectures(path, sort));

  const {
    data: teachersData,
    error: teachersError,
    isLoading: teachersLoading,
  } = useSWR<UserData[] | null>('teachers', getTeachers);

  // if (lecturesLoading) return <p>loading...</p>;
  // if (teachersLoading) return <p>loading...</p>;
  // if (lecturesError) return <p>error</p>;
  // if (teachersError) return <p>error</p>;

  if (sortParam === 'teacher') {
    list = teachersData?.map((item, index) => (
      <SwiperSlide key={index}>
        <TeacherCard key={index} item={item} />
      </SwiperSlide>
    ));
  } else {
    list = lecturesData?.map((item, index) => (
      <SwiperSlide key={index}>
        <Card key={index} item={item} />
      </SwiperSlide>
    ));
  }

  return (
    <>
      <Swiper
        slidesPerView={2}
        // centeredSlides={true}
        spaceBetween={0}
        navigation={true}
        modules={[Navigation]}
        className="cardSwiper"
        breakpoints={{
          768: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
        }}
      >
        {list}
        {/* <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide> */}

        {/* <div className="navigation-wrapper">
          <div className="swiper-button-prev">prev</div>
          <div className="swiper-button-next">next</div>
        </div> */}

        {/* <div className="navigation-wrapper">
          <div className="swiper-button-prev">prev</div>
          <div className="swiper-button-next">next</div>
        </div> */}
      </Swiper>
    </>
  );
}

export default SwiperCard;
