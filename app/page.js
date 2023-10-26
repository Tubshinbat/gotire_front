import SideSearch from "components/Generals/SideSearch";
import GoogleAnalytics from "components/GoogleAnalytics";
import HomeMenu from "components/Home/HomeMenu";
import MakeTopList from "components/Home/MakeTopList";
import ReachTires from "components/Home/ReachTires";
import SearchHeaderBox from "components/Home/SearchHeaderBox";
import WheelList from "components/Home/WheelList";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
        <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
      ) : null}
      <HomeMenu />
      {/* <SearchHeaderBox /> */}
      <MakeTopList />
      <ReachTires />
      <WheelList />
      <SideSearch />
    </>
  );
}
