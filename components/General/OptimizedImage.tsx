import Image from 'next/image'
interface Props {
  src: string
  width?: number
  height?: number
  layout?: 'intrinsic' | 'fixed' | 'fill' | 'responsive' | undefined
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  className?: string
}

const OptimizedImage = ({
  src,
  layout,
  height,
  width,
  rounded,
  className,
}: Props) => {
  return (
    <Image
      placeholder='blur'
      blurDataURL={src}
      src={src}
      width={width || 150}
      layout={layout}
      height={height || 150}
      loading='lazy'
      objectFit='cover'
      className={'rounded-' + rounded + ' ' + className}
    />
  )
}

export default OptimizedImage
