import '../style_modules/InnerLoaderStyle.css'
export default function InnerLoader() {
    return (
        <div
            style={{width: '100%', height: '100%'}}
            className='flex justify-center items-center'
        >
            <div className="spinner"></div>
        </div>
    )
}