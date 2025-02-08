"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Fireworks from "./Fireworks"

const denominations = [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000]
const vietnameseNameRegex = /^[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯẠ-ỹ ]+$/i

const vietnameseBanks = [
  { name: "Ngân hàng TMCP Ngoại thương Việt Nam", code: "VCB" },
  { name: "Ngân hàng TMCP Công thương Việt Nam", code: "CTG" },
  { name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam", code: "BIDV" },
  { name: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam", code: "AGR" },
  { name: "Ngân hàng TMCP Kỹ thương Việt Nam", code: "TCB" },
  { name: "Ngân hàng TMCP Á Châu", code: "ACB" },
  { name: "Ngân hàng TMCP Sài Gòn Thương Tín", code: "STB" },
  { name: "Ngân hàng TMCP Quân đội", code: "MBB" },
  { name: "Ngân hàng TMCP Việt Nam Thịnh Vượng", code: "VPB" },
  { name: "Ngân hàng TMCP Tiên Phong", code: "TPB" },
  { name: "Ngân hàng TMCP Phương Đông", code: "OCB" },
  { name: "Ngân hàng TMCP Quốc tế Việt Nam", code: "VIB" },
  { name: "Ngân hàng TMCP Hàng Hải Việt Nam", code: "MSB" },
  { name: "Ngân hàng TMCP Bưu điện Liên Việt", code: "LPB" },
  { name: "Ngân hàng TMCP Đông Nam Á", code: "SSB" },
  { name: "Ngân hàng TMCP Việt Á", code: "VAB" },
  { name: "Ngân hàng TMCP Bản Việt", code: "VCCB" },
  { name: "Ngân hàng TMCP Sài Gòn", code: "SCB" },
  { name: "Ngân hàng TMCP Xăng dầu Petrolimex", code: "PGB" },
  { name: "Ngân hàng TMCP Đại Chúng Việt Nam", code: "PVB" },
]

const BankOption = ({ bank }: { bank: (typeof vietnameseBanks)[number] }) => (
  <span>
    {bank.name} ({bank.code})
  </span>
)

export default function LuckyDraw() {
  const [fullname, setFullname] = useState("")
  const [selectedBank, setSelectedBank] = useState<(typeof vietnameseBanks)[number] | null>(null)
  const [accountNumber, setAccountNumber] = useState("")
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentNumber, setCurrentNumber] = useState(0)
  const [showFireworks, setShowFireworks] = useState(false)
  const [amountWon, setAmountWon] = useState(0)
  const [spinTime, setSpinTime] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [notification, setNotification] = useState("")

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isSpinning) {
      intervalId = setInterval(() => {
        setCurrentNumber(Math.floor(Math.random() * 200000))
      }, 50)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isSpinning])

  const spinWheel = async () => {
    setNotification("")
    setShowFireworks(false)

    if (fullname.trim() === "" || !selectedBank || accountNumber.trim() === "") {
      alert("Vui lòng điền đầy đủ thông tin trước khi quay!")
      return
    }

    if (!vietnameseNameRegex.test(fullname)) {
      alert("Vui lòng nhập tên bằng tiếng Việt hợp lệ!")
      return
    }

    setIsSpinning(true)
    setSpinTime(new Date().toISOString())

    setTimeout(async () => {
      const randomIndex = Math.floor(Math.random() * denominations.length)
      const amount = denominations[randomIndex]
      setIsSpinning(false)
      setCurrentNumber(amount)
      setAmountWon(amount)
      setShowFireworks(true)
      setShowResult(true)

      // Gửi dữ liệu ngay sau khi quay xong
      await sendDataToGoogleSheet(amount)

      // Tắt pháo hoa sau 5 giây
      setTimeout(() => setShowFireworks(false), 5000)
    }, 3000) // Spin for 3 seconds
  }

  const sendDataToGoogleSheet = async (amount: number) => {
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbzAkz8ViHknib0VpVRWtq9y8b59vSLnxLNic5a_V0agTrVTO-H4xBDP2Ee37cxw6KBGSQ/exec"
    const formData = new FormData()
    formData.append("spinTime", spinTime)
    formData.append("name", fullname)
    formData.append("amount", amount.toString())
    formData.append("bankName", selectedBank!.name)
    formData.append("accountNumber", accountNumber)

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
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md mx-auto px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">Quà 14/02 Pink Dev</h1>
        <Card className="mb-6 w-full">
          <CardContent className="p-6">
            <Input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Nhập họ và tên"
              className="mb-4 w-full text-lg"
              aria-label="Họ và tên"
            />
            <Select
              onValueChange={(value) => setSelectedBank(vietnameseBanks.find((bank) => bank.name === value) || null)}
            >
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Chọn ngân hàng">
                  {selectedBank && <BankOption bank={selectedBank} />}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {vietnameseBanks.map((bank) => (
                  <SelectItem key={bank.code} value={bank.name}>
                    <BankOption bank={bank} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Số tài khoản"
              className="mb-4 w-full"
              aria-label="Số tài khoản"
            />
            <Button onClick={spinWheel} className="w-full text-lg py-4 sm:py-6" disabled={isSpinning}>
              {isSpinning ? "Đang quay..." : "Quay Ngay"}
            </Button>
          </CardContent>
        </Card>

        {(isSpinning || showResult) && (
          <Card className="mb-6 w-full">
            <CardContent className="p-6">
              <p className="text-xl sm:text-2xl font-bold text-green-600 text-center">
                {isSpinning
                  ? `${currentNumber.toLocaleString()} VND`
                  : `Chúc mừng ${fullname} đã nhận được ${amountWon.toLocaleString()} VND`}
              </p>
            </CardContent>
          </Card>
        )}

        {showResult && (
          <Card className="mb-6 w-full overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Kết quả quay thưởng</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thông tin</TableHead>
                    <TableHead>Giá trị</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Thời gian</TableCell>
                    <TableCell>{new Date(spinTime).toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Họ và tên</TableCell>
                    <TableCell>{fullname}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Số tiền trúng</TableCell>
                    <TableCell>{amountWon.toLocaleString()} VND</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tên ngân hàng</TableCell>
                    <TableCell>{selectedBank?.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Số tài khoản</TableCell>
                    <TableCell>{accountNumber}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {notification && (
          <p
            className={`text-sm sm:text-base font-bold text-center ${
              notification.includes("thành công") ? "text-green-600" : "text-red-600"
            }`}
          >
            {notification}
          </p>
        )}
      </div>
      <Fireworks isActive={showFireworks} />
    </div>
  )
}

