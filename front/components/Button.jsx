export default function Button({ children, onClick, type='button' }){
return (
<button type={type} onClick={onClick} className="px-4 py-2 bg-blue-600 text-white rounded">{children}</button>
)
}