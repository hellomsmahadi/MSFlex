(() => {
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    "cmsfilter",
    async (filtersInstances) => {
      const [filtersInstance] = filtersInstances;
      const { listInstance } = filtersInstance;
      const [firstItem] = listInstance.items;
      const itemTemplateElement = firstItem.element;
      const products = await fetchProducts();
      listInstance.clearItems();
      const newItems = products.map((product, index) =>
        createItem(product, index, itemTemplateElement)
      );
      await listInstance.addItems(newItems);
      const filterTemplateElement = filtersInstance.form.querySelector(
        '[data-element="filter"]'
      );
      if (!filterTemplateElement) return;
      const filtersWrapper = filterTemplateElement.parentElement;
      if (!filtersWrapper) return;
      filterTemplateElement.remove();
      const categories = collectCategories(products);
      for (const category of categories) {
        const newFilter = createFilter(category, filterTemplateElement);
        if (!newFilter) continue;
        filtersWrapper.append(newFilter);
      }
      filtersInstance.storeFiltersData();

      // Call copy function and DOM observer
      initializeCopyButtons();
      observeDomChanges();
    },
  ]);

  // Fetch data from the new API endpoint
  var fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:vEyiBDFq/my_component_test_database_1"
      );
      const data = await response.json();
      data.sort((a, b) => a.Serial_number - b.Serial_number);
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  // Slug à¦¤à§ˆà¦°à¦¿à¦° function
  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "") // à¦…à¦ªà§à¦°à§Ÿà§‹à¦œà¦¨à§€à§Ÿ à¦•à§à¦¯à¦¾à¦°à§‡à¦•à§à¦Ÿà¦¾à¦° à¦¸à¦°à¦¾à¦¨à§‹
      .replace(/\s+/g, "-"); // à¦«à¦¾à¦à¦•à¦¾ à¦œà¦¾à§Ÿà¦—à¦¾ "-" à¦¦à¦¿à§Ÿà§‡ à¦ªà§à¦°à¦¤à¦¿à¦¸à§à¦¥à¦¾à¦ªà¦¨
  }

  // Create an item using the new data format
  var createItem = (product, index, templateElement) => {
    const newItem = templateElement.cloneNode(true);
    const dynaSerialValue = String(index + 1).padStart(2, "0");

    // Update all matching elements
    const images = newItem.querySelectorAll('[data-element="image"]');
    const titles = newItem.querySelectorAll('[data-element="title"]');
    const categories = newItem.querySelectorAll('[data-element="category"]');
    const descriptions = newItem.querySelectorAll(
      '[data-element="description"]'
    );
    const serialsNo = newItem.querySelectorAll('[data-element="serial-no"]');
    const componentPrice = newItem.querySelectorAll(
      '[data-element="component-Price"]'
    );
    const comparePrice = newItem.querySelectorAll(
      '[data-element="compare-price"]'
    );
    const jsonTxts = newItem.querySelectorAll('[data-element="json-txt"]');
    const dynaSerials = newItem.querySelectorAll('[data-element="dynaSerial"]');
    const readMoreButtons = newItem.querySelectorAll(
      '[data-element="read-more"]'
    );

    // Update images
    images.forEach((image) => {
      image.src = product.Image_Link;
    });

    // Update titles
    titles.forEach((title) => {
      title.textContent = product.Title;
    });

    // Update Component_Price
    componentPrice.forEach((Price) => {
      Price.textContent = product.Component_Price;
    });
    // Update Component_Price
    comparePrice.forEach((compPrice) => {
      compPrice.textContent = product.Compare_price;
    });

    // Update categories
    categories.forEach((category) => {
      category.textContent = product.Select_Category_Component;
    });

    // Update serialNo
    serialsNo.forEach((serialNo) => {
      serialNo.textContent = `${product.Serial_number}`;
    });

    // Update descriptions
    descriptions.forEach((description) => {
      description.textContent = `${product.Description}`;
    });

    // Update JSON text
    jsonTxts.forEach((jsonTxt) => {
      jsonTxt.textContent = JSON.stringify(product.Json_original_text, null, 2);
    });

    // Update dynamic serial number
    dynaSerials.forEach((dynaSerial) => {
      dynaSerial.textContent = `${dynaSerialValue}`;
    });

    // Add event listener to Read More button
    readMoreButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const slug = generateSlug(product.Title); // Generate slug from product title

        // Redirect to free page if category is Free
        if (product.Select_Category_Component === "Free") {
          const detailsPageUrl = `/free-example2?=${slug}-${product.Serial_number}-${product.id}-${product.Unique_text}`;
          window.location.href = detailsPageUrl;
        } else {
          const detailsPageUrl = `/example2-details?=${slug}-${product.Serial_number}-${product.id}-${product.Unique_text}`;
          window.location.href = detailsPageUrl;
        }
      });
    });

    return newItem;
  };

  // Collect unique categories
  var collectCategories = (products) => {
    const categories = new Set();
    for (const { Select_Category_Component } of products) {
      categories.add(Select_Category_Component);
    }
    return [...categories];
  };

  // Create a filter element
  var createFilter = (category, templateElement) => {
    const newFilter = templateElement.cloneNode(true);
    const label = newFilter.querySelector("span");
    const radio = newFilter.querySelector("input");
    if (!label || !radio) return;
    label.textContent = category;
    radio.value = category;
    return newFilter;
  };
})();
