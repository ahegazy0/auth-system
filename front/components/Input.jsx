export default function Input({ value, onChange, placeholder, type='text' }){
return (
<input value={value} onChange={onChange} placeholder={placeholder} type={type}
className="w-full p-2 border rounded bg-white" />
)
}