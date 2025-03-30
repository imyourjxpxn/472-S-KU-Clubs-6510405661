interface Props {
    isLoading? : boolean;
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

export default function Loading({isLoading, fallback, children}: Props) {
    if (isLoading) return fallback;
    return children;
}