<template>
  <div class="file-upload">
    <div class="file-upload-left">
      <div>
        <v-icon color="primary" class="file-upload-drop-icon"
          >mdi-cloud-upload</v-icon
        >
      </div>
      <div class="file-upload-drop-text">
        Drop file here
        <br />or
      </div>
      <v-btn
        elevation="1"
        small
        color="primary"
        class="buttontext--text file-upload-browse-button"
        >Browse</v-btn
      >
    </div>
    <div class="file-upload-right">
      <div class="file-upload-info-label">Type: -</div>
      <div class="file-upload-info-label">Size: -</div>
      <div class="file-upload-info-label">Created: -</div>
      <div class="file-upload-info-label">Modified: -</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "file-upload",
  props: {},
};
</script>
<style>
.file-upload {
  width: 300px;
  height: 120px;
  margin-bottom: 50px;
}

.file-upload-left {
  float: left;
  background-color: #eee;
  width: 120px;
  border-radius: 5%;
  padding: 5px;
}

.file-upload-right {
  margin-left: 10px;
  float: left;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.file-upload-drop-icon {
  position: relative;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}

.file-upload-drop-text {
  font-size: 18px;
  text-align: center;
}

.file-upload-browse-button {
  position: relative;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}
</style>
