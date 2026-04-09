const SimpleLoader = () => {
    return (
        <div className="flex flex-col gap-3 w-full max-w-sm mx-auto p-4">

            <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />

            <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />

            <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />

            <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mx-auto" />

        </div>
    );
};

export default SimpleLoader;