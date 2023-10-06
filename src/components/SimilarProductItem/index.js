const SimilarProductItem = props => {
  const {similarProductsDetails} = props
  const {imageUrl, title, brand, price, rating} = similarProductsDetails
  return (
    <li>
      <img src={imageUrl} alt={`similar product ${title}`} />
      <h1>{title}</h1>
      <p>by {brand}</p>
      <div>
        <p>{price}</p>
        <p>{rating}</p>
      </div>
    </li>
  )
}

export default SimilarProductItem
