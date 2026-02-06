import MENU_DB from '../data/menus';
import { THRESHOLD } from '../data/defaults';

export const getAvailableMenus = (inventory) => {
  return MENU_DB.filter(menu =>
    Object.entries(menu.ingredients).every(
      ([item, qty]) => (inventory[item] || 0) >= qty
    )
  );
};

export const deductInventory = (inventory, menu, servingsMultiplier = 1) => {
  const newInv = { ...inventory };
  Object.entries(menu.ingredients).forEach(([item, qty]) => {
    newInv[item] = Math.round(((newInv[item] || 0) - qty * servingsMultiplier) * 100) / 100;
    if (newInv[item] < 0) newInv[item] = 0;
  });
  return newInv;
};

export const getProcurementList = (inventory) => {
  const list = {};
  Object.entries(inventory).forEach(([item, qty]) => {
    if (qty < (THRESHOLD[item] || 0.1)) {
      list[item] = (THRESHOLD[item] || 1.0) * 2;
    }
  });
  return list;
};
