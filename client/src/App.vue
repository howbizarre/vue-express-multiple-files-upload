<script lang="ts" setup>
import { ref } from 'vue';

const selectedImages = ref<FileList>();

/**
 * Handles the change event of the file input element.
 * Updates the selectedImages value with the selected files.
 * 
 * @param {Event} event - The change event object.
 */
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) selectedImages.value = target.files;
};

/**
 * Submits the selected images to the server for upload.
 * 
 * @async
 * @function submitImages
 * @returns {Promise<void>}
 */
const submitImages = async (): Promise<void> => {
  if (selectedImages.value) {
    const formData = new FormData();

    for (const file of selectedImages.value) {
      formData.append('images', file);
    }

    try {
      const response = await fetch('http://localhost:9100/uploads', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Hip, hip...', data);
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error('Error while uploading images:', error);
    }
  }
};
</script>

<template>
  <form @submit.prevent="submitImages" enctype="multipart/form-data">
    <input type="file" multiple @change="handleFileChange" />
    <button type="submit">Submit</button>
  </form>
</template>