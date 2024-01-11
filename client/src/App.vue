<script lang="ts" setup>
import { ref } from 'vue';

const selectedImages = ref<FileList | null>(null);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  
  if (target.files) selectedImages.value = target.files;
};

const submitImages = async () => {
  if (selectedImages.value) {
    const formData = new FormData();

    for (let i = 0; i < selectedImages.value.length; i++) {
      formData.append('images', selectedImages.value[i]);
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
      console.error('Ooops, wft...', error);
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