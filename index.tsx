"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

const denominations = [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000]
const vietnameseNameRegex = /^[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯẠ-ỹ ]+$/i

export default function LuckyDraw() {
  const [fullname, setFullname] = useState("")
  const [result, setResult] = useState("Nhấn nút để quay thưởng")
  const [notification, setNotification] = useState("")

  const spinWheel = () => {
    setNotification("")

    if (fullname.trim() === "") {
      alert("Vui lòng nhập họ và tên trước khi quay!")
      return
    }

    if (!vietnameseNameRegex.test(fullname)) {
      alert("Vui lòng nhập tên bằng tiếng Việt hợp lệ!")
      return
    }

    const randomIndex = Math.floor(Math.random() * denominations.length)
    const amountWon = denominations[randomIndex]
    setResult(`${fullname} nhận được ${amountWon.toLocaleString()} VND`)

    sendDataToGoogleSheet(fullname, amountWon)
  }

  const sendDataToGoogleSheet = async (name: string, amount: number) => {
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbzAkz8ViHknib0VpVRWtq9y8b59vSLnxLNic5a_V0agTrVTO-H4xBDP2Ee37cxw6KBGSQ/exec"
    const formData = new FormData()
    formData.append("name", name)
    formData.append("amount", amount.toString())

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      })

      console.log("Response status:", response.status)
      console.log("Response type:", response.type)

      setNotification("Dữ liệu đã được gửi thành công!")
    } catch (error) {
      console.error("Lỗi chi tiết:", error)
      setNotification("Lỗi khi gửi dữ liệu: " + (error instanceof Error ? error.message : String(error)))
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Quay Thưởng quà 14/02 Pink Dev</h1>
      <Input
        type="text"
        value={fullname}
        onChange={(e) => setFullname(e.target.value)}
        placeholder="Nhập họ và tên"
        className="mb-4 max-w-xs w-full"
        aria-label="Họ và tên"
      />
      <Card className="mb-4 max-w-xs w-full">
        <CardContent className="p-4">
          <p className="text-xl font-bold text-green-600">{result}</p>
        </CardContent>
      </Card>
      <Button onClick={spinWheel} className="mb-4">
        Quay Ngay
      </Button>
      {notification && (
        <p className={`text-sm font-bold ${notification.includes("thành công") ? "text-green-600" : "text-red-600"}`}>
          {notification}
        </p>
      )}
    </div>
  )
}

