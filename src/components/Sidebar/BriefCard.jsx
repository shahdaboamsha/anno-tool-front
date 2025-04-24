import '../style_modules/briefCard.css'

export default function BriefCard({ icon, title, description }) {

    
    return (
        <>
            <div className="brcard min-w-[200px] h-[250px] bg-gray-200 grow">
                <div className="icon">
                    {icon}
                </div>
                <div  className='span flex flex-col items-center justify-center gap-3'>
                    <h1 className='text-[22px] font-semibold'>{title}</h1>
                    <span className='p-5'>{description}</span>
                </div>

            </div>
        </>

    )
}