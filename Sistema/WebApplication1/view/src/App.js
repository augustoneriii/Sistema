import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from './context/UserContext';
import { SidebarProvider } from './context/SideBarContext';
import AppRoutes from './Routes/Routes';
import AuthenticatedComponents from './utils/AuthenticatedComponents';
import { ToastProvider } from './context/ToastContext';
import { ZIndexProvider } from "./context/ZIndexContext";

const App = () => {
    return (
        <div className="App">
            <Router>
                <ZIndexProvider>
                    <ToastProvider>
                        <UserProvider>
                            <SidebarProvider>
                                <AuthenticatedComponents />
                                <main className="relative w-full m-auto" style={{ height: '100vh' }}>
                                    <AppRoutes />
                                </main>
                            </SidebarProvider>
                        </UserProvider>
                    </ToastProvider>
                </ZIndexProvider>
            </Router>
        </div>
    );
}

export default App;
