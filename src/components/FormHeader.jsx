export default function FormHeader({ title, text, start = null }) {
    return (
        <div>
            <h1 className='text-[32px] text-center'>{title}</h1>
            <p className="form-header-desc" style={{ textAlign: start ? 'start' : 'center' }}>{text}</p>
        </div>
    )
}