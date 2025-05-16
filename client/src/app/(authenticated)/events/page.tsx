import { Button } from "@/components";
import Link from "next/link";

function page() {
    return (
        <div>
            Hello, this is events page
            <Link href="/events/create">
                <Button>Create Event</Button>
            </Link>
        </div>
    );
}

export default page;
