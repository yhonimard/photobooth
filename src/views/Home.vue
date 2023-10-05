<template>
  <div>
    <b-overlay :show="show" rounded="sm">
      <template #overlay>
        <b-spinner></b-spinner>
        <span class="ml-3 font-weight-bold" style="font-size: 30px">
          Loading Please Wait...
        </span>
      </template>
      <div
        class="wrapper text-center"
        :style="{ 'background-image': 'url(' + data.img_background + ')' }"
      >
        <div v-if="isBusy" class="text-center mb-4">
          <b-spinner variant="info" />
        </div>
        <b-card
          v-else
          no-body
          style="min-width: 25rem; background-color: transparent"
        >
          <b-list-group flush>
            <b-list-group-item
              class="center"
              style="height: 75px; background-color: transparent"
            >
              <h1
                class="font-bebas font-weight-bold m-0"
                style="font-size: 80px"
              >
                {{ data.title }}
              </h1>
            </b-list-group-item>
            <b-list-group-item
              class="center pb-0"
              style="height: 30px; background-color: transparent"
            >
              <h4
                class="font-bebas font-weight-bold m-0"
                style="letter-spacing: 0.2rem; font-size: 35px"
              >
                {{ data.subtitle?.toUpperCase() }}
              </h4>
            </b-list-group-item>

            <div style="padding-top: 3em">
              <div
                style="
                  display: flex;
                  justify-content: space-evenly;
                  align-items: center;
                  flex-basis: 300px;
                  column-gap: 10px;
                "
              >
                <dropdown
                  :datas="paketData"
                  :onClick="selectPaketHandler"
                  :dropdownTitle="dropdownTitle"
                  :boothId="boothId"
                />
                <button
                  style="
                    width: 50%;
                    padding: 7.5px 20px;
                    border-radius: 20px;
                    cursor: pointer;
                    position: relative;
                  "
                  :class="`${
                    boothId === '2'
                      ? 'orange-custom-color border-color-custom'
                      : 'green-color border-orange'
                  }`"
                  @click="openModalVoucher"
                >
                  <p
                    :class="`${boothId === '2' ? 'font-bebas' : 'font-putih'}`"
                    style="color: black; font-weight: 600; letter-spacing: 2px"
                  >
                    use voucher
                  </p>
                </button>
              </div>

              <div style="margin-top: 20px">
                <span
                  class="font-bebas"
                  style="font-size: 20px; letter-spacing: 1.5px"
                  v-if="!isFree"
                >
                  PRICE :
                  {{
                    formatMoney(selectedDataPaket.price, {
                      symbol: "IDR",
                      precision: 0,
                      thousand: ".",
                    })
                  }}
                </span>
                <span
                  class="font-bebas"
                  style="font-size: 20px; letter-spacing: 1.5px"
                  v-else
                >
                  THIS IS FREE FOR TESTING
                </span>
              </div>
            </div>

            <b-list-group-item
              :class="`center p-0 mx-auto ${
                boothId === '2'
                  ? 'orange-custom-color border-color-custom'
                  : 'text-white green-color border-orange'
              }`"
              style="
                height: 42px;
                border-radius: 47px;
                width: 200px;
                border: 2px solid rgba(65, 65, 65, 255);
                box-shadow: 0 0 2px rgba(black, 0.8);
                margin-top: 25px;
              "
              v-if="dropdownTitle !== 'choose package'"
            >
              <input
                type="range"
                style="position: relative; z-index: 2"
                v-model="progressValue"
                min="0"
                max="100"
                step="1"
                :class="`${boothId === '2' ? 'progress' : 'progress-2'}`"
                :disabled="dropdownTitle === 'choose package'"
                @change="openModalPay"
              />
              <div
                style="
                  position: absolute;
                  left: 43%;
                  z-index: 1;
                  display: flex;
                  align-items: center;
                "
              >
                <p
                  style="
                    margin: 0;
                    padding: 0;
                    letter-spacing: 1px;
                    font-weight: bold;
                    color: black;
                  "
                  :class="`${boothId === '2' ? 'font-bebas' : 'font-putih'}`"
                >
                  {{ boothId === "2" ? "slide to start" : "" }}
                </p>

                <span style="font-size: 35px; margin-bottom: 10px">
                  &raquo;
                </span>
              </div>
            </b-list-group-item>
          </b-list-group>
        </b-card>
        <modal-voucher @set="setVoucher" />
        <modal-payment
          @reload="openModalPay"
          :item="transaction"
          :time="time"
        />
      </div>
    </b-overlay>
  </div>
</template>

<script>
import ModalVoucher from "@/components/ModalVoucher.vue";
import ModalPayment from "@/components/ModalPayment.vue";
import { formatMoney } from "accounting-js";
import moment from "moment";
import api from "@/api";
import Dropdown from "../components/CustomDropdown.vue";

export default {
  props: {},

  components: {
    ModalVoucher,
    ModalPayment,
    Dropdown,
  },

  data: () => ({
    data: {
      img_background: "",
      img_logo: "",
      booth_id: "",
      title: "",
      subtitle: "",
      package: "",
      pricing: false,
    },
    isVoucher: false,
    voucher: null,
    isBusy: true,
    progressValue: 0,
    form: {},
    interval: null,
    time: 0,
    show: false,
    paketData: [],
    selectedDataPaket: {
      price: 0,
      description: "",
      package_name: "",
      total: 0,
    },
    dropdownTitle: "choose package",
    boothId: null,
    isFree: false,
    voucherAmount: null,
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
    paket: {
      get: function () {
        return this.$store.state.paket;
      },
      set: function (v) {
        return this.$store.commit("paket", v);
      },
    },
    activeTr() {
      const isAv =
        new Date(this.transaction.trx_expiration_time).getTime() >
        new Date().getTime();
      return this.transaction && this.transaction.trx_id && isAv;
    },
  },

  mounted() {
    this.boothId = this.$route.params.boothId;
    localStorage.setItem("boothId", JSON.stringify(this.boothId))
    this.fetchBackground();
    this.fetchVoucher();
    this.fetchPaket();
    if (this.activeTr) {
      if (this.payment.status === "COMPLETE") {
        this.$store.commit("allowed", true);

        clearInterval(this.interval);

        this.$router.push({ path: `/${this.boothId}/select-frame` });
      }

      this.$bvModal.show("modal-payment");
    } else {
      this.payment = {};
      this.transaction = {};
    }
    this.interval = setInterval(this.check, 3000);
  },

  methods: {
    formatMoney,
    async fetchBackground() {
      const { data } = await api.matoaphotobooth.background(this.boothId);
      this.data = data;

      if (!this.data.pricing) {
        this.selectedDataPaket.price = 0;
      }

      this.isBusy = false;
    },

    async fetchVoucher() {
      const { data } = await api.matoaphotobooth.voucher();
      this.voucher = data;
    },

    openModalVoucher() {
      if (this.dropdownTitle === "choose package") return;
      if (!this.isVoucher) {
        this.$bvModal.show("modal-prevent-closing");
      }
    },
    async openModalPay() {
      this.show = true;
      this.transaction = {};
      this.time = 0;

      const datas = {
        price: this.selectedDataPaket.price,
      };

      let data;
      try {
        data = await api.matoaphotobooth.createTr(datas);
      } catch (error) {
        alert("connection error pls try again");
        console.log("error", error);
      }

      if (!data.payment_info?.qris_url || !data.payment_info) {
        console.log("qr gaadaaa");
        alert("connection error pls try again");
        return;
      }

      const expTime = new Date().getTime() + 300000;
      const dateExp = moment(expTime).format("YYYY-MM-DD HH:mm:ss");

      data.trx_expiration_time = dateExp;

      this.transaction = data;
      this.time = expTime;

      this.$bvModal.show("modal-payment");

      this.$nextTick(() => {
        api.matoaphotobooth.checkTr({
          partner_trx_id: data.partner_trx_id,
        });

        this.progressValue = 0;
      });
      this.show = false;
    },
    async setVoucher(value) {
      const checkVoucher = this.voucher.find(
        (v) => v.code === value.toUpperCase()
      );
      if (checkVoucher) {
        this.voucherAmount = parseInt(checkVoucher.value);
        if (parseInt(checkVoucher.value) === 100) {
          this.isFree = true;
          this.$bvToast.toast("SUCCESS ADD VOUCHER FOR FREE", {
            headerClass: "d-none",
            solid: true,
            variant: "success",
            toaster: "b-toaster-top-center",
          });
          this.$bvModal.hide("modal-prevent-closing");

          return;
        }
        const disc = (this.selectedDataPaket.price * checkVoucher.value) / 100;

        this.selectedDataPaket.price -= disc;

        this.$nextTick(() => {
          this.$bvToast.toast("SUCCESS ADD VOUCHER", {
            headerClass: "d-none",
            solid: true,
            variant: "success",
            toaster: "b-toaster-top-center",
          });
        });

        this.data.voucher_id = checkVoucher.id;
        this.isVoucher = true;

        this.$bvModal.hide("modal-prevent-closing");
      } else {
        this.$nextTick(() => {
          this.$bvToast.toast("VOUCHER NOT FOUND", {
            headerClass: "d-none",
            solid: true,
            variant: "danger",
            toaster: "b-toaster-top-center",
          });

          this.data.voucher_id = undefined;
          this.isVoucher = false;
        });
      }
    },

    async check() {
      try {
        const tr = this.$store.state.transaction;
        if (tr.partner_trx_id && this.selectedDataPaket.id) {
          const datas = {
            partner_trx_id: tr.partner_trx_id,
            package_id: this.selectedDataPaket.id,
            booth_id: this.data.id,
            discount: this.voucherAmount || "none",
          };

          const data = await api.matoaphotobooth.checkCb(datas);

          if (this.isFree && data.status === "FREE_PAYMENT") {
            this.$store.commit("payment", data);
            this.$store.commit("allowed", true);

            clearInterval(this.interval);
            this.$router.push({ path: `/${this.boothId}/select-frame` });
            this.isFree = false;
            return;
          }

          if (data.status === "COMPLETE" || this.data.pricing) {
            this.$store.commit("payment", data);
            this.$store.commit("allowed", true);

            clearInterval(this.interval);
            this.$router.push({ path: `/${this.boothId}/select-frame` });
          }
        }
      } catch (error) {
        console.log("error from callback", error);
      }
    },

    async fetchPaket() {
      const { data } = await api.matoaphotobooth.fetchDataPaket(this.boothId);
      this.paketData = data;
    },

    selectPaketHandler(paket) {
      this.selectedDataPaket = { ...paket };
      this.dropdownTitle = paket.package_name;

      const total = {
        totalPaket: parseInt(paket.total),
        index: 1,
      };

      localStorage.setItem("paket", JSON.stringify(total));
      this.paket = total;
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  border: none;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.center {
  border: none;
  height: 75px;
  align-items: center;
  display: flex;
  justify-content: center;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: none;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  height: 100vh;
  width: 100vw;
  overflow: auto;
  position: relative;
}

.btn-voucher {
  cursor: pointer;
}

.progress {
  background-color: transparent;
  height: 200%;
  width: 100%;
  outline: none;
  transition: background 450ms ease-in;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border-radius: 50px;
}

.progress-2 {
  background-color: transparent;
  height: 200%;
  width: 100%;
  outline: none;
  transition: background 450ms ease-in;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border-radius: 50px;
}

input::-moz-range-thumb {
  width: 135px;
  height: 10px;
  appearance: none;
  -moz-appearance: none;
  cursor: ew-resize;
  border: none;
  background-color: transparent;
  background-position: right;
  background-repeat: no-repeat;
  background-size: cover;
}
.progress::-webkit-slider-thumb {
  width: 135px;
  height: 180px;
  appearance: none;
  -webkit-appearance: none;
  cursor: ew-resize;
  background-position: right;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("../assets/btn-slide.png");
}

.progress-2::-webkit-slider-thumb {
  width: 135px;
  height: 180px;
  appearance: none;
  -webkit-appearance: none;
  cursor: ew-resize;
  background-position: right;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("../assets/btn-slide1.png");
}

.custom-dropdown:focus {
  box-shadow: none;
}
</style>
<!-- <b-dropdown
no-caret
variant="none"
:class="`animationDropdown ${
  boothId === '2'
    ? 'orange-custom-color border-color-custom'
    : 'green-color border-orange'
}`"
button-class="custom-dropdown"
style="width: 50%; padding: 1px 0; border-radius: 20px"
>
<template #button-content>
  <p
    :class="`${
      boothId === '2' ? 'font-bebas' : 'font-putih'
    }`"
    style="
      color: black;
      font-weight: 600;
      letter-spacing: 2px;
    "
  >
    {{ dropdownTitle }}
  </p>
</template>
<b-dropdown-item
  v-for="paketItem in paketData"
  :key="paketItem.id"
  @click="() => selectPaketHandler(paketItem)"
>
  {{ paketItem.package_name }}
</b-dropdown-item>
</b-dropdown> -->
