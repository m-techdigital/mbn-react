import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled, WarningFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
const icons={success:<CheckCircleFilled/>,error:<CloseCircleFilled/>,warning:<WarningFilled/>,info:<InfoCircleFilled/>};
export default function ToastCenter(){
  const [items,setItems]=useState([]);
  useEffect(()=>{const onToast=(event)=>{const id=crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`;const item={id,type:event.detail?.type||'info',message:event.detail?.message||'',duration:event.detail?.duration||3200};setItems(current=>[...current.slice(-2),item]);window.setTimeout(()=>setItems(current=>current.filter(entry=>entry.id!==id)),item.duration)};window.addEventListener('mbn:toast',onToast);return()=>window.removeEventListener('mbn:toast',onToast)},[]);
  return <div className="mbn-toast-center" aria-live="polite">{items.map(item=><div key={item.id} className={`mbn-toast mbn-toast--${item.type}`}><span>{icons[item.type]}</span><p>{item.message}</p><button type="button" onClick={()=>setItems(current=>current.filter(entry=>entry.id!==item.id))}>×</button></div>)}</div>
}
