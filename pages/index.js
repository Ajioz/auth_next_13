import { getSession } from "next-auth/react";
import StartingPageContent from "../components/starting-page/starting-page";

function HomePage() {
  return <StartingPageContent />;
}

export default HomePage;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
