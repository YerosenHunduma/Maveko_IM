export const mapProductToWoocommerceSchema = (products) => {
  const pattern = /^\/([^\/]+)\//;

  return {
    create: products.map((product) => {
      const match = product.ancestry.match(pattern);
      const category = match ? match[1] : "";

      return {
        name: product.name,
        type: "simple",
        regular_price: product.price.toString(),
        description: product.description,
        short_description: product.customs_description,
        sku: product.code,
        manage_stock: true,
        stock_quantity: product.quantity,
        in_stock: true,
        categories: [
          {
            name: category,
          },
        ],
        images: [
          {
            src: product.productImg,
            name: product.name,
            alt: product.name,
          },
        ],
      };
    }),
  };
};
