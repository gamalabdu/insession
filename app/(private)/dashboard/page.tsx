import Header from "@/components/ui/Header";
import ListItem from "@/components/ListItem";
import getSongs from "@/actions/getSongs";
import PageContent from "./components/PageContent";
import getUserProfileInfo from "@/actions/getUserProfileInfo";

import { Suspense } from "react";
import ProfileSetupModal from "@/components/modals/ProfileSetupModal";

export const revalidate = 0;

export default async function Dashboard() {
  
  const songs = await getSongs();

  const userProfileInfo = await getUserProfileInfo();

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Suspense fallback="Loading">
        <Header>
          <div className="mb-2">
            <h1 className="text-white text-3xl font-semibold">
              {" "}
              Welcome back {userProfileInfo.first_name},{" "}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">

              <ListItem
                image={{
                  src: "https://picsum.photos/200/300",
                  width: 200,
                  height: 300,
                }}
                name={"Liked Songs"}
                href={"liked"}
              />

              <ListItem
                image={{
                  src: "https://picsum.photos/200/300",
                  width: 200,
                  height: 300,
                }}
                name={"Liked Artist"}
                href={"liked-artist"}
              />


              <ListItem
                image={{
                  src: "https://picsum.photos/200/300",
                  width: 200,
                  height: 300,
                }}
                name={"Your Songs"}
                href={"mysongs"}
              />


            </div>
          </div>
        </Header>
      </Suspense>

      <div className="mt-2 mb-7 px-6">
        
        {/* <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">
            {userProfileInfo?.username}'s Most Liked songs'
          </h1>
        </div> */}

        {/* <PageContent
          songs={songs}
          userProfileInfo={userProfileInfo}
        /> */}

        <h1> Trending Producers </h1>

        <h1> Trending Artist </h1>

        <h1> Producers you might like </h1>

        <h1> Contest </h1>

      </div>

      <ProfileSetupModal userProfileInfo={userProfileInfo} />
      
    </div>
  );
}
