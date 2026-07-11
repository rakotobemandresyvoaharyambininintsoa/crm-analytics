export function formatNumber(
  value:number
){

  return value.toLocaleString(
    "fr-FR"
  );

}



export function formatCurrency(
  value:number
){

  return (
    value.toLocaleString("fr-FR")
    +
    " Ar"
  );

}



export function formatQuantity(
  value:number
){

  return (
    value.toLocaleString("fr-FR")
    +
    " unités"
  );

}