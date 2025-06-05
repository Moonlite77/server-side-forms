'use server'

export async function formOneAction(prevState: number, data: FormData){
    const coolNumber = Number(data.get('userInputNumberOne'))
    const coolerNumber = coolNumber + 5
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });

    return coolerNumber
}

export async function formTwoAction(data: FormData){
    const coolerNumber = "hello"

    return coolerNumber
}