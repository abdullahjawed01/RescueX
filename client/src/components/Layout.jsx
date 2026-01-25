const Layout = ({ children }) => {
    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Main Content */}
            <main className="w-full h-full">
                {children}
            </main>
        </div>
    );
};

export default Layout;
