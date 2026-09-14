import React, { useEffect, useState } from 'react'
import { Button, EditableText, InputGroup } from '@blueprintjs/core'

const ProductDetails = () => {

    const [products, setProducts] = useState([])
    const [newProductUrl, setProductUrl] = useState("")
    const [newName, setName] = useState("")
    const [newRate, setRate] = useState("")
    const [newProductInfo, setProductInfo] = useState("")

    useEffect(() => {
        fetch("https://bookstore-u3rm.onrender.com/product/get", {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "userId": localStorage.getItem("userId")
            }
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json, "Api response")
                setProducts(json.data.products || [])
            })
    }, [])

    const addProduct = () => {
        const url = newProductUrl.trim()
        const name = newName.trim()
        const rate = newRate.trim()
        const productInfo = newProductInfo.trim()
        if (url && name && rate && productInfo) {
            fetch("https://bookstore-u3rm.onrender.com/product/create",
                {
                    method: "POST",
                    body: JSON.stringify({
                        imageUrl: url,
                        name,
                        rate,
                        productInfo
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "userId": localStorage.getItem("userId")
                    }
                }
            )
                .then((response) => response.json())
                .then(data => {
                    setProducts([...products, data.data])
                    setProductUrl("")
                    setName("")
                    setRate("")
                    setProductInfo("")
                })
        }

    }
    return (
        <div>

            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Product Image</th>
                            <th>Name</th>
                            <th>Rate</th>
                            {/* <th>Product Info</th> */}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product =>
                            <tr key={product._id}>
                                <td><img src={product.imageUrl} alt="aaaaa" /></td>
                                <td><EditableText value={product.name} /></td>
                                <td><EditableText value={product.rate} /></td>
                                <td>
                                    <Button>Add</Button>
                                    <Button>Delete</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td><InputGroup value={newProductUrl} onChange={(e) => setProductUrl(e.target.value)} placeholder='Enter Image Url...' /></td>
                            <td><InputGroup value={newName} onChange={(e) => setName(e.target.value)} placeholder='Enter Name' /></td>
                            <td><InputGroup value={newRate} onChange={(e) => setRate(e.target.value)} placeholder='Enter Rate' /></td>
                            <td><InputGroup value={newProductInfo} onChange={(e) => setProductInfo(e.target.value)} placeholder='Enter Product Info' /></td>
                            <td><Button onClick={addProduct}>Add Product</Button></td>
                        </tr>
                    </tfoot>
                </table>

            </div>

        </div>
    )
}

export default ProductDetails