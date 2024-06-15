import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const app = createApp({
  data() {
    return {
      numImagesPerLoad: 12,
      imageUrls: [],
      loading: false,
      errorMessage: null // Ensure errorMessage is initially null
    };
  },
  methods: {
    async loadCatImages(count) {
      this.loading = true;
      this.errorMessage = null; // Clear previous error messages

      const promises = [];

      for (let i = 0; i < count; i++) {
        promises.push(
          fetch('https://cataas.com/cat')
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.blob();
            })
            .then(blob => URL.createObjectURL(blob))
            .catch(error => {
              console.error(error);
              return null;
            })
        );
      }

      try {
        const results = await Promise.all(promises);
        const validResults = results.filter(result => result !== null);
        this.imageUrls.push(...validResults);

        if (validResults.length < count) {
          this.errorMessage = 'Failed to load some images. Please try again.';
        }
      } catch (error) {
        this.errorMessage = 'An error occurred while loading images. Please try again.';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    loadMoreCatImages() {
      this.loadCatImages(this.numImagesPerLoad);
    }
  },
  mounted() {
    this.loadCatImages(this.numImagesPerLoad);
  }
});

app.mount('#app');
