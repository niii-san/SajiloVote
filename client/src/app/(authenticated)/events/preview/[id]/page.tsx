async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <div>Showing preview of: {id}</div>;
}

export default Page;
