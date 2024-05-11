import PageLayout from "../components/pageLayout";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <PageLayout>
            {children}
        </PageLayout>
    );
}
