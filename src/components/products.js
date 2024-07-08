import Product from './product';
function Products(props)
{
   
    const listProduct=props.member.product.map(function(item)
    {
        return (
                <Product member={item}/>

        );
    });
    
    return(
        <div id="list-product">
            {listProduct}
        </div>
    )
}

export default Products;