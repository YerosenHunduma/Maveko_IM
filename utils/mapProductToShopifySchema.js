export const mapProductToShopifySchema = (products) => {
  return products.map((product) => ({
    product: {
      title: product.name,
      body_html: product.description,
      vendor: product.source_id.name,
      product_type: product.ancestry.split("/").pop(),
      tags: product.ancestry.replace(/^\//, "").replace(/\//g, ","),
      images: product.productImg ? [{ src: product.productImg }] : [],
      variants: [
        {
          price: "1199.00", // This price can be dynamic
          sku: product.code,
          inventory_quantity: product.quantity,
          weight: product.weight,
          weight_unit: "kg",
        },
      ],
      status: "active",
    },
  }));
};
