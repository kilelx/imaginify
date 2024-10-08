import Image from "next/image"
import { dataUrl, getImageSize, debounce } from "@/lib/utils";
import { CldImage } from "next-cloudinary"
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";


const TransformedImage = ({image, type, title, transformationConfig, isTransforming, setIsTransforming, hasDownload=false}: TransformedImageProps) => {

    const downloadHandler = () => {

    }

  return (
    <div className="flex flex-col gap-4">
        <div className="flex-between">
            <h3 className="h3-bold text-dark-600">
                Transformed
            </h3>

            { hasDownload && (
                <button className="download-btn" onClick={downloadHandler}>
                    <Image
                        src="/assets/icons/download.svg"
                        alt="Download"
                        width={24}
                        height={24}
                        className="pb-[6px]"
                    />
                </button>
            )}
        </div>

        {image?.publicId && transformationConfig ? (
            <div className="relative">
                <CldImage
                    width={getImageSize(type, image, "width")}
                    height={getImageSize(type, image, "height")}
                    src={image?.publicId}
                    alt={image.title}
                    sizes={"(max-width: 767px) 100vw, 50vw"}
                    placeholder={dataUrl as PlaceholderValue}
                    className="transformed-image"
                    onLoad={() => {
                        // Check if setIsTransforming, and if it's the case, pass it to false
                        setIsTransforming && setIsTransforming(false)
                    }}
                    onError={() => {
                        debounce(() => {
                            setIsTransforming && setIsTransforming(false)
                        }, 8000)
                    }}
                    // Extend all props of transformationConfig to cldImage
                    {...transformationConfig}
                />

                {isTransforming && (
                    <div className="transforminng-loader">
                        <Image
                            src="/assets/icons/spinner.svg"
                            width={50}
                            height={50}
                            alt="Transforming"
                        />
                    </div>
                )}
            </div>
        ): (
            <div className="transformed-placeholder">
                Transformed Image
            </div>
        )}
    </div>
  )
}
export default TransformedImage