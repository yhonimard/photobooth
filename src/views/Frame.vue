<template>
  <div :class="`${boothId === '2' ? 'wrapper' : 'wrapper-1'}`">
    <div v-if="isBusy" class="text-center mb-4">
      <b-spinner variant="info" />
    </div>

    <div
      style="display: flex; width: 100%; height: 100%; flex-direction: column"
    >
      <div style="display: flex; margin-bottom: 10px">
        <div style="width: 30%">
          <h2 class="font-bebas text-center font-weight-bold">PREVIEW FRAME</h2>
        </div>
        <h2 class="font-bebas text-center font-weight-bold" style="width: 70%">
          SELECT FRAME
        </h2>
      </div>
      <div
        :class="`${boothId === '2' ? 'orange-custom-color' : 'green-color'}`"
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 80%;
          padding: 20px;
          border-radius: 20px;
          border: 2px solid #25523c;
        "
      >
        <div v-if="!isBusy" class="first-card h-100">
          <div class="d-flex card-height">
            <b-img-lazy
              :src="frameSelected.img_frame_left"
              alt="frame"
              style="width: auto; height: 100%"
            />
            <b-img-lazy
              :src="frameSelected.img_frame_right"
              alt="frame"
              style="width: auto; height: 100%"
            />
          </div>
        </div>
        <div v-if="!isBusy" class="second-card mx-4 h-100">
          <div class="card-height" style="background-color: transparent">
            <b-row
              class="h-100"
              style="padding: 0 16px; background-color: transparent"
            >
              <b-col cols="12" style="border-radius: 15px">
                <div v-if="!frames.length" class="text-center">
                  <b-spinner v-if="busy" variant="primary" />
                  <span v-else>No Data</span>
                </div>
                <ul v-else :style="gridStyle" class="card-list m-3 p-0">
                  <b-overlay
                    v-for="(item, p) in frames"
                    :key="p"
                    :show="frameSelected.name === item.name"
                    variant="dark"
                    opacity="0.85"
                    blur="none"
                    style="width: 210px"
                  >
                    <template #overlay>
                      <h4 class="text-white font-weight-bold">Selected</h4>
                    </template>
                    <div
                      class="d-flex"
                      style="background-color: #e9e9e9; width: 205px"
                      @click="onItemClick(item)"
                    >
                      <b-img-lazy
                        :src="item.img_frame_left"
                        alt="frame"
                        style="width: 105px"
                        fluid
                      />
                      <b-img-lazy
                        :src="item.img_frame_right"
                        alt="frame"
                        style="width: 105px"
                        fluid
                      />
                    </div>
                  </b-overlay>
                </ul>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!isBusy"
      class="ml-5 rounded-circle"
      :class="`${boothId === '2' ? 'button-capture' : 'button-capture-1'}`"
      @click="goToCamera"
    ></div>
  </div>
</template>

<script>
import api from "@/api";

export default {
  props: {},

  components: {},

  data: () => ({
    frames: [
      {
        img_frame_left: "",
        img_frame_right: "",
      },
    ],
    frameSelected: {
      id: null,
      img_frame_left: null,
      img_frame_right: null,
    },
    isBusy: true,
    boothId: null,
  }),

  computed: {
    gridStyle() {
      return {
        gridTemplateColumns: `repeat(3, minmax(100px, 1fr))`,
      };
    },
  },

  mounted() {
    this.boothId = this.$route.params.boothId;
    this.fetchFrames();
    this.sendUserTracking();
  },


  beforeCreate() {
    if (!this.$store.state.allowed) {
      const boothId = this.$route.params.boothId;
      this.$router.replace(`/${boothId}/home`);
    }
  },

  methods: {
    async fetchFrames() {
      const { data } = await api.matoaphotobooth.frame(this.boothId);

      this.frames = data;
      this.frameSelected = data[0];
      this.isBusy = false;
    },
    onItemClick(value) {
      this.frameSelected = value;
    },

    goToCamera() {
      localStorage.setItem("frame", JSON.stringify(this.frameSelected));
      this.$router.push({ path: `/${this.boothId}/camera` }).catch((err) => {
        console.log("error when push to camera", err);
      });
    },

    async sendUserTracking() {
      const tr = this.$store.state.transaction;
      const userTrackingIndex = JSON.parse(localStorage.getItem("paket"));

      const datas = {
        trx_id: tr.trx_id,
        page: `select-frame-${userTrackingIndex.index}`,
      };

      const data = await api.matoaphotobooth.userTracking(datas);
    },
  },
};
</script>

<style lang="scss" scoped>
.b-overlay-wrap {
  width: 236px;
}

.col,
.col-12 {
  padding: 0px;
}

.card-list {
  display: grid;
  grid-gap: 1em;
}

.card-height {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #e9e9e9;
}

.card-height::-webkit-scrollbar {
  display: none;
}

.col {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  width: 100%;
}

.col-height {
  height: 42%;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 75px;
  height: 100vh;
  background-image: url("../assets/bg-select-frame.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
}

.wrapper-1 {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 75px;
  height: 100vh;
  background-image: url("../assets/bg-select-frame1.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
}

.button-capture {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 170px;
  height: 170px;
  background-image: url("../assets/btn-capture.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
}

.button-capture-1 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 170px;
  height: 170px;
  background-image: url("../assets/btn-capture1.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
}
</style>
