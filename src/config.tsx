export const sizeChoices = [
  { label: "S", value: 1200 },
  { label: "M", value: 1920 },
  { label: "L", value: 3200 },
  { label: "XL", value: 4096 },
  { label: "XXL", value: 6000 },
  { label: "XXXL", value: 8192 }
];

export const defaultSize = sizeChoices[1].value;

export const aspectRatioChoices = [
  {
    label: "3:4",
    value: 3 / 4
  },
  {
    label: "1:1",
    value: 1
  },
  {
    label: "4:3",
    value: 4 / 3
  },
  {
    label: "3:2",
    value: 1.5
  },
  {
    label: "16:9",
    value: 16 / 9
  }
];

export const defaultAspectRatio = aspectRatioChoices[1].value;
