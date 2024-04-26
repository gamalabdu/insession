import Header from "@/components/ui/Header";
import ListItem from "@/components/ListItem";
import getSongs from "@/actions/getSongs";
import PageContent from "./components/PageContent";
import getUserProfileInfo from "@/actions/getUserProfileInfo";
import ProfileSetupModal from "@/components/ProfileSetupModal";

export const revalidate = 0;

export default async function Dashboard() {
  const songs = await getSongs();
  const userProfileInfo = await getUserProfileInfo();

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
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
          </div>
        </div>
      </Header>

      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">
            {userProfileInfo?.username}'s Most Liked songs'
          </h1>
        </div>

        <PageContent
          songs={songs}
          heroImage={userProfileInfo?.avatar_url || ""}
        />
      </div>

      <ProfileSetupModal userProfileInfo={userProfileInfo} />
    </div>
  );
}
