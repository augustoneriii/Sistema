import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from './context/UserContext'
import { SidebarProvider } from './context/SideBarContext'
import AppRoutes from './Routes/Routes';
import AuthenticatedComponents from './utils/AuthenticatedComponents';


const App = () => {

    return (
        <div className="App">
            <Router>
                <UserProvider>
                    <SidebarProvider>
                        <AuthenticatedComponents />
                        <main className="relative w-9 m-auto" style={{ height: '100vh' }} >
                            <AppRoutes /> {/* Use o componente de rotas aqui */}
                        </main>
                    </SidebarProvider>
                </UserProvider>
            </Router>
        </div>
    );
}


export default App;
