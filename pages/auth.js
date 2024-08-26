import { getSession } from "next-auth/react";
import AuthForm from "../components/auth/auth-form";

function AuthPage() {
  return <AuthForm />;
}

export default AuthPage;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  // console.log({ session });
  if (!session) {
    return {
      props: {
        session,
      },
    };
  }
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}
