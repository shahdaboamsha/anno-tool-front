import { useNavigate } from "react-router-dom";

export default function Card({ title, description, image, action }) {

    const navigate = useNavigate()
    return (
        <div className="flex flex-col justify-start items-center p-4 min-w-[350px] grow animation-view">
            <div className="max-w-[100px]">
                <img src={image} alt="" className="w-full" />
            </div>
            <h1 className="text-[22px] font-bold text-center">{title}</h1>
            <p className="text-[18px] p-0 text-center">{description}</p>
            <p className='text-[14px] mt-2 text-center text-blue-500 hover:text-blue-400 cursor-pointer text-underlined'>
                {title}
            </p>
        </div>
    )
}