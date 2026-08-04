import fs from 'node:fs'
const read=(p)=>fs.readFileSync(p,'utf8')
const main=read('src/main.jsx'), root=read('src/app/RootApp.jsx'), appCss=read('src/styles/app.css'), index=read('src/index.css'), account=read('src/components/account/AccountRouteShell.jsx')
const failures=[]
if (!main.includes('lazy(() => import("./app/RootApp"))')) failures.push('RootApp phải là lazy bootstrap owner.')
if (/from ["']antd/.test(main) || main.includes('ConfigProvider')) failures.push('main.jsx không được kéo AntD runtime vào initial graph.')
for (const token of ['MbnThemeProvider','BrowserRouter','AuthProvider','<App />']) if(!root.includes(token)) failures.push(`RootApp thiếu ${token}`)
for (const routeStyle of ['pages/home.css','pages/catalog.css','pages/detail.css','marketplace-account-presentation.css','interaction-purchase-detail.css']) if(appCss.includes(routeStyle)) failures.push(`${routeStyle} không được quay lại global app.css`)
if (index.includes('customer-account.css')) failures.push('customer-account.css không được quay lại initial index.css')
for (const token of ['customer-account.css','form-controls.css']) if(!account.includes(token)) failures.push(`AccountRouteShell thiếu ${token}`)
if (failures.length) { console.error(failures.join('\n')); process.exit(1) }
console.log('MBN initial bundle ownership PASS.')
