import { cookies } from "next/headers";

export default  async function Home() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    return (
        <div className="">
            <h1>"You're logged in" : "You're not logged in {accessToken}</h1>
        </div>
    );
}
