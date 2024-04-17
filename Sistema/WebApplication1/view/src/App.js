 import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import { UserProvider } from './context/UserContext'
 import { SidebarProvider } from './context/SideBarContext'
 import { useState } from 'react';
 import AppRoutes from './Routes/Routes';
 import AuthenticatedComponents from './utils/AuthenticatedComponents';

function App() {
     const [token] = useState(localStorage.getItem('token') || '');

   return (
     <div className="App">
       <Router>
         <UserProvider>
           <SidebarProvider>
             {token && <AuthenticatedComponents />}
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
