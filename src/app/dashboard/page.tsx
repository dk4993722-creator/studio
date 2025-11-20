import { Suspense } from "react";
import { DashboardClientPage } from "./client-page";

function Dashboard() {
    return <DashboardClientPage />;
}

export default function DashboardPage() {
    return (
        <Suspense>
            <Dashboard />
        </Suspense>
    );
}
