import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productItemsData: {},
    similarProducts: [],
    quantity: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getData = fetchedData => ({
    id: fetchedData.id,
    imageUrl: fetchedData.image_url,
    title: fetchedData.title,
    style: fetchedData.style,
    price: fetchedData.price,
    description: fetchedData.description,
    brand: fetchedData.brand,
    totalReviews: fetchedData.total_reviews,
    rating: fetchedData.rating,
    availability: fetchedData.availability,
  })

  onClickMinus = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onClickPlus = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const formattedData = this.getData(fetchedData)
      console.log(formattedData)
      const similarProductsData = fetchedData.similar_products.map(each =>
        this.getData(each),
      )
      console.log(similarProductsData)
      this.setState({
        productItemsData: formattedData,
        similarProducts: similarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickContinue = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <button type="button" onClick={this.onClickContinue}>
        Continue Shopping
      </button>
    </div>
  )

  renderProductItem = () => {
    const {productItemsData, quantity, similarProducts} = this.state
    const {
      imageUrl,
      title,

      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productItemsData
    return (
      <div className="products-item-data">
        <Header />
        <div className="product-details">
          <img src={imageUrl} className="image" alt="product" />
          <div className="other-details">
            <h1 className="heading">{title}</h1>
            <p className="price">{price}</p>
          </div>
          <div>
            <button type="button">
              <p>{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
              />
            </button>
            <p>{totalReviews}</p>
          </div>
          <p>{description}</p>
          <p>Available: {availability}</p>
          <p>Brand: {brand}</p>
          <hr />
          <div>
            <button
              type="button"
              onClick={this.onClickMinus}
              data-testid="minus"
            >
              <BsDashSquare />
            </button>
            <p>{quantity}</p>
            <button
              type="button"
              className="quantity-controller-button"
              onClick={this.onClickPlus}
              data-testid="plus"
            >
              <BsPlusSquare className="quantity-controller-icon" />
            </button>
          </div>
          <button type="button">Add to Cart</button>
        </div>
        <div>
          <ul>
            {similarProducts.map(each => (
              <SimilarProductItem key={each.id} similarProductsDetails={each} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFinalView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItem()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderFinalView()}</div>
  }
}

export default ProductItemDetails
