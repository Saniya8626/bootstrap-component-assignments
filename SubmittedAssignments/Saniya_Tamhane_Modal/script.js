class ModalComponent extends HTMLElement {
  static observedAttributes = ["config", "data"];

  defaultConfig = {
    modalContainerClass: "modal",
    modalDialogClass: "modal-dialog",
    modalContentClass: "modal-content",
    modalHeaderClass: "modal-header",
    modalTitleClass: "modal-title",
    modalBodyClass: "modal-body",
    modalFooterClass: "modal-footer",
    closeButtonClass: "close",
    backdropClass: "modal-backdrop fade show",
    modalOpenClass: "modal-open",
  };

  defaultData = {
    title: "New Message to @mdo",
    links: [
      { label: "Gmail", url: "https://mail.google.com/" },
      { label: "GitHub", url: "https://github.com/" },
    ],
    tableData: [
      {
        name: "John Doe",
        age: 25,
        qualification: "B.Sc",
      },
      {
        name: "Jane Smith",
        age: 40,
        qualification: "M.A",
      },
      {
        name: "Saniya Tamhane",
        age: 28,
        qualification: "B.Tech",
      },
      {
        name: "Valmiki Tamhane",
        age: 30,
        qualification: "B.Tech",
      },
    ],

    galleryImages: [
      {
        src: "https://img.freepik.com/free-photo/close-up-portrait-caucasian-unshaved-man-eyeglasses-looking-camera-with-sincere-smile-isolated-gray_171337-630.jpg?t=st=1739117085~exp=1739120685~hmac=fda23c9b681061ad9555c217492058a5b1260740f8d68bcc296683047ab6ca0a&/300",
        alt: "Sample Image 1",
      },
    ],
  };

  data = {};
  config = {};

  constructor() {
    super();
    this.data = { ...this.defaultData };
    this.config = { ...this.defaultConfig };
  }

  connectedCallback() {
    this.renderComponent();
    this.addEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    try {
      // Ensure the incoming value is a valid JSON string
      if (name === "config" && typeof newValue === "string") {
        this.config = Object.assign(this.config, JSON.parse(newValue));
      }
      if (name === "data" && typeof newValue === "string") {
        this.data = Object.assign(this.data, JSON.parse(newValue));
      }
    } catch (error) {
      console.error("Error parsing attributes:", error);
      alert(
        `There was an error parsing the JSON for the '${name}' attribute. Please check the format.`
      );
    }

    // Re-render the component after changes
    this.renderComponent();
  }

  renderComponent() {
    this.innerHTML = "";
    const modalContainer = this.createElement(
      "div",
      this.config.modalContainerClass
    );
    modalContainer.style.display = "none";

    const modalDialog = this.createElement("div", this.config.modalDialogClass);
    const modalContent = this.createElement(
      "div",
      this.config.modalContentClass
    );

    modalContent.appendChild(this.renderHeader());
    modalContent.appendChild(this.renderBody());
    modalContent.appendChild(this.renderFooter());

    modalDialog.appendChild(modalContent);
    modalContainer.appendChild(modalDialog);
    this.appendChild(modalContainer);
  }

  renderHeader() {
    const modalHeader = this.createElement("div", this.config.modalHeaderClass);
    const modalTitle = this.createElement(
      "h5",
      this.config.modalTitleClass,
      this.data.title
    );
    const closeButton = this.createElement(
      "button",
      this.config.closeButtonClass,
      "×"
    );

    closeButton.setAttribute("aria-label", "Close");

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    return modalHeader;
  }
  renderLinks() {
    const ul = this.createElement("ul", "list-unstyled d-flex");
    this.data.links.forEach((link) => {
      const li = this.createElement("li", "mr-3");
      const a = this.createElement("a", "", link.label);
      a.href = link.url;
      a.target = "_blank";
      li.appendChild(a);
      ul.appendChild(li);
    });
    return ul;
  }
  renderBody() {
    const modalBody = this.createElement("div", this.config.modalBodyClass);
    modalBody.appendChild(this.renderLinks());
    modalBody.appendChild(this.renderTable());
    modalBody.appendChild(this.renderGallery());
    modalBody.appendChild(this.renderForm());

    return modalBody;
  }

  renderFooter() {
    const modalFooter = this.createElement("div", this.config.modalFooterClass);
    const closeBtn = this.createElement(
      "button",
      "btn btn-secondary close-btn btn-ms",
      "Close"
    );
    const submitBtn = this.createElement(
      "button",
      "btn btn-primary submit-btn btn-ms",
      "Send message"
    );

    modalFooter.appendChild(closeBtn);
    modalFooter.appendChild(submitBtn);
    return modalFooter;
  }

  renderTable() {
    const table = this.createElement("table", "table table-bordered");
    const thead = this.createTableHeader();
    const tbody = this.createElement("tbody");

    this.data.tableData.forEach((row) => {
      const tr = this.createElement("tr");

      Object.keys(row).forEach((key) => {
        const td = this.createElement("td");

        // If the column is "profile picture", display the image URL as text
        if (key === "profile picture" && row[key]) {
          td.textContent = row[key]; // Display the URL as text
        } else {
          td.textContent = row[key]; // Otherwise, just display the text content
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
  }
  renderGallery() {
    const gallery = this.createElement(
      "div",
      "gallery-grid d-flex justify-content-around"
    );
    this.data.galleryImages.forEach((image) => {
      const img = this.createElement("img", "img-thumbnail");
      img.src = image.src;
      img.alt = image.alt;
      gallery.appendChild(img);
    });
    return gallery;
  }

  createTableHeader() {
    // This code is used for dyanamic Field adding from outside the componets
    const thead = this.createElement("thead");
    const tr = this.createElement("tr");
    const headers = Object.keys(this.data.tableData[0] || {});

    headers.forEach((header) => {
      const th = this.createElement(
        "th",
        "",
        header.charAt(0).toUpperCase() + header.slice(1)
      );
      tr.appendChild(th);
    });

    thead.appendChild(tr);
    return thead;
  }
  renderForm() {
    const form = this.createElement("form", "");
    form.id = "studentForm";

    form.appendChild(this.createField("Recipient:", "recipient", "text"));
    form.appendChild(this.createTextArea("Message:", "message", "text"));

    return form;
  }

  createField(labelText, id) {
    const div = this.createElement("div", "mb-3");
    const label = this.createElement("label", "form-label", labelText);
    label.setAttribute("for", id);

    const input = this.createElement("input", "form-control");
    input.id = id;
    input.required = true;

    div.appendChild(label);
    div.appendChild(input);
    return div;
  }

  createTextArea(labelText, id) {
    const div = this.createElement("div", "mb-3");
    const label = this.createElement("label", "form-label", labelText);
    label.setAttribute("for", id);

    const textarea = this.createElement("textarea", "form-control");
    textarea.id = id;
    textarea.required = true;

    div.appendChild(label);
    div.appendChild(textarea);
    return div;
  }

  createElement(tag, className, content = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
  }

  addEventListeners() {
    this.addEventListener("click", (e) => {
      if (e.target.classList.contains("close-btn")) this.hideModal();
      if (e.target.classList.contains("submit-btn")) this.handleSubmit();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.hideModal();
    });
  }

  showModal() {
    const modal = this.querySelector(`.${this.config.modalContainerClass}`);
    modal.style.display = "block";
    document.body.classList.add(this.config.modalOpenClass);
    this.createBackdrop();
  }

  hideModal() {
    const modal = this.querySelector(`.${this.config.modalContainerClass}`);
    modal.style.display = "none";
    document.body.classList.remove(this.config.modalOpenClass);
    this.removeBackdrop();
  }

  createBackdrop() {
    this.backdrop = this.createElement("div", this.config.backdropClass);
    document.body.appendChild(this.backdrop);
  }

  removeBackdrop() {
    if (this.backdrop) {
      this.backdrop.remove();
      this.backdrop = null;
    }
  }

  handleSubmit() {
    const form = this.querySelector("#studentForm");
    if (form.checkValidity()) {
      swal("Done!", "Send Your Message Successfully", "success");
      this.hideModal();
    } else {
      form.reportValidity();
    }
  }
}

customElements.define("modal-component", ModalComponent);
