<template>
  <b-modal
    id="modal-payment"
    ref="modal"
    @show="resetModal"
    @hidden="resetModal"
    hide-footer
    no-close-on-backdrop
    no-close-on-esc
    centered
  >
    <div class="text-center">
      <h5>Scan To Pay</h5>
      <div>Pay with QRIS Application</div>
      <img
        v-if="transaction.payment_info?.qris_url"
        class="mt-2 mb-3"
        :show="transaction.payment_info?.qris_url"
        :src="transaction.payment_info.qris_url"
        alt="QR"
        width="250"
      />
      <div v-else> 
        
      </div>
      <div>
        <img class="mr-2" src="../assets/icon-bca.png" alt="bca" width="25" />
        <img class="mr-2" src="../assets/icon-dana.png" alt="dana" width="40" />
        <img
          class="mr-2"
          src="../assets/icon-gopay.png"
          alt="gopay"
          width="40"
        />
        <img src="../assets/icon-jenius.png" alt="jenius" width="40" />
        <br />
        <img
          class="mr-2"
          src="../assets/icon-mandiri.png"
          alt="mandiri"
          width="25"
        />
        <img class="mr-2" src="../assets/icon-ovo.png" alt="ovo" width="40" />
        <img src="../assets/icon-spay.png" alt="spay" width="40" />
      </div>
      <div class="mt-2 font-weight-bold">
        If your payment error/failed occurs
        <br />
        “Please Try Other Payment Method”
      </div>
      <!-- <div>
        <vac :end-time="time">
          <span slot="process" slot-scope="{ timeObj }" class="text-secondary">
            Waiting your payment in ({{ `${timeObj.m}:${timeObj.s}` }})</span
          >
          <span slot="finish">
            <a class="text-uppercase" @click="cancel()">
              Reload QRIS
            </a>
          </span>
        </vac>
      </div> -->
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    item: Object,
    time: Number,
  },

  components: {},

  data: () => ({
    timer: null,
    name: "",
    nameState: null,
    submittedNames: [],
    expiredPin: 0,
  }),

  computed: {
    transaction: {
      get: function () {
        return this.$store.state.transaction;
      },
      set: function (v) {
        this.$store.commit("transaction", v);
      },
    },
    payment: {
      get: function () {
        return this.$store.state.payment;
      },
      set: function (v) {
        this.$store.commit("payment", v);
      },
    },
  },

  mounted() {},

  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      // Push the name to submitted names

      // Hide the modal manually
      this.$nextTick(() => {
        this.resetModal();
      });
    },
    // cancel() {
    //   this.transaction = {};
    //   this.$bvModal.hide("modal-payment");
    //   this.$emit("reload");
    // },
    resetModal() {
      this.name = this.$options.data().name;
      this.nameState = this.$options.data().nameState;
      this.submittedNames = this.$options.data().submittedNames;
      this.$bvModal.hide("modal-payment");
    },
    handleOk(bvModalEvent) {
      // Prevent modal from closing
      bvModalEvent.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
  },
};
</script>

<style lang="scss">
.close {
  color: #fff !important;
}
</style>
