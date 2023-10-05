<template>
  <div class="">
    <div class="btn-wrap" style="width: 140px">
      <div
        @click="toggleShow"
        :class="`anchor ${
          boothId === '2'
            ? 'orange-custom-color border-color-custom'
            : 'green-color border-orange'
        }`"
        style="padding: 7.5px 20px; border-radius: 20px; width: 171.38px"
      >
        <span
          :class="`${boothId === '2' ? 'font-bebas' : 'font-putih'}`"
          style="color: black; font-weight: 600; letter-spacing: 2px"
        >
          {{ dropdownTitle }}
        </span>
      </div>
    </div>
    <div v-if="showMenu" class="menu">
      <div
        class="menu-item"
        v-for="item in datas"
        :key="item.id"
        @click="itemClicked(item)"
      >
        {{ item.package_name }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "dropdown-menu",

  data: () => ({ showMenu: false }),
  props: {
    onClick: () => {},
    datas: [],
    dropdownTitle: "",
    boothId: "",
  },
  methods: {
    toggleShow() {
      this.showMenu = !this.showMenu;
    },
    itemClicked(item) {
      this.toggleShow();
      this.onClick(item);
    },
  },
};
</script>
<style lang="scss" scoped>
.anchor {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  width: 100%;
  position: relative;
  overflow: hidden;
  animation: shadow 2.5s infinite;

  ::after {
    width: 0;
    height: 0;
    background: #fff;
    content: "";
    height: 100px;
    left: -75px;
    opacity: 0.2;
    // box-shadow: 1px 1px 1px rgba(255, 255, 255, 0.1);
    position: absolute;
    top: -50px;
    transform: rotate(35deg);
    transition: all 550ms cubic-bezier(0.19, 1, 0.22, 1);
    width: 20px;
    animation: whiteline 2.5s infinite ease;
  }
  span {
    z-index: 10;
  }
  @keyframes whiteline {
    0% {
      left: -20%;
    }

    100% {
      left: 120%;
    }
  }
  @keyframes shadow {
    50% {
      box-shadow: 0 0 40px #25523c;
    }
  }
}

.menu {
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  color: #212529;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  list-style: none;
  margin: 0.125rem 0 0;
  padding: 0.5rem 0;
  position: absolute;
  text-align: left;
  z-index: 100;
}

.menu-item {
  color: #212529;
  padding: 0.25rem 1.5rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.menu-item:hover {
  background-color: #f4f6f6;
  cursor: pointer;
}

.btn-wrap {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1em;
  text-align: center;
}
</style>
