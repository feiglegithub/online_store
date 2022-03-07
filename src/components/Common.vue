<script>
function getAllPrimaryClassification() {
  this.axios
    .get("/primaryClassification/getAll")
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      this.$notify.error({
        title: "错误",
        message: err,
        duration: 0,
      });
    });
}

export default {
  getAllPrimaryClassification,
};
</script>