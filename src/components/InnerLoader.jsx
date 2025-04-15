import './style_modules/InnerLoaderStyle.css'
export default function InnerLoader() {
    return (
        <div
            style={{width: '100%', height: '100%', marginTop: '10px', marginBottom: '10px'}}
            className='flex justify-center items-center'
        >
            <div className="spinner"></div>
        </div>
    )
}